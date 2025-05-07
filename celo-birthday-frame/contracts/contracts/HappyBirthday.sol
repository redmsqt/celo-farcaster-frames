// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

contract CeloBirthdayFrame is SelfVerificationRoot, Ownable {
    using SafeERC20 for IERC20;

    // Enum to define the type of birthday route
    enum BirthdayRoute {
        NotSet, // Default value
        Money, // Monetary gifts
        Donation // Donations to a project

    }

    // Struct to store birthday record details
    struct BirthdayRecord {
        address celebrant; // Address of the celebrant
        BirthdayRoute route; // Selected birthday route
        address token; // Token address for Money route
        string category; // Category for Donation route
        string donationProjectUrl; // URL of the donation project
        uint256 donationProjectId; // ID of the donation project
        uint256 creationDate; // Timestamp of record creation
        uint256 moneyGiftsReceived; // Total monetary gifts received
    }

    // Mapping to store birthday records by user address
    mapping(address => BirthdayRecord) public birthdayRecords;

    // Mapping to track used nullifiers for proof verification
    mapping(uint256 => bool) internal _nullifiers;

    // Mapping to track registered celebrants
    mapping(address => bool) internal _registeredCelebrants;
    mapping(address => string[]) internal _celebrant_names;

    // Events for logging
    event NewGiftReceived(address sender, address indexed recipient, uint256 amount);
    event NewBirthdayRecord(address indexed celebrant, uint256 creation_date);
    event NewCelebrant(address indexed celebrant, uint256 creation_date);

    // Custom errors for specific conditions
    error RegisteredNullifier();
    error UnRegisteredNullifier();
    error RegisteredCelebrant();
    error UnRegisteredCelerbrant();
    error InvalidAmount();
    error OnlyMoneyRoute();
    error RecordAlreadyExists();
    error NotWithinBirthdayWindow();
    error MissingRequiredField();

    // Constructor to initialize the contract with verification parameters
    constructor(
        address _identityVerificationHub,
        uint256 _scope,
        uint256 _attestationId,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub,
            _scope,
            _attestationId,
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        )
        Ownable(_msgSender())
    {}

    // Function to create a new birthday record
    function createBirthdayRecord(
        address celebrant,
        BirthdayRoute route,
        address token,
        string memory category,
        string memory donationProjectUrl,
        uint256 donationProjectId
    ) external {
        // Ensure the user is registered
        if (!isCelebrantRegistered(celebrant)) {
            revert UnRegisteredCelerbrant();
        }

        // Ensure the user doesn't already have a record
        if (birthdayRecords[celebrant].creationDate > 0) {
            revert RecordAlreadyExists();
        }

        // Validate required fields based on the selected route
        if (route == BirthdayRoute.Money ? token == address(0) : bytes(donationProjectUrl).length == 0) {
            revert MissingRequiredField();
        }

        // Create and store the birthday record
        birthdayRecords[celebrant] = BirthdayRecord({
            celebrant: celebrant,
            route: route,
            token: token,
            category: category,
            donationProjectUrl: donationProjectUrl,
            donationProjectId: donationProjectId,
            creationDate: block.timestamp,
            moneyGiftsReceived: 0
        });

        // Emit event
        emit NewBirthdayRecord(celebrant, block.timestamp);
    }

    // Function to verify a self-proof
    function verifySelfProof(IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof) public override {
        // Validate the proof's scope
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        // Validate the proof's attestation ID
        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        // Ensure the nullifier hasn't been used before
        if (_nullifiers[proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX]]) {
            revert RegisteredNullifier();
        }

        // Verify the proof using the identity verification hub
        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub
            .verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );

        // Convert revealed data to bytes
        bytes memory charcodes = Formatter.fieldElementsToBytes(result.revealedDataPacked);

        // Check if the user is within the birthday window
        if (_isWithinBirthdayWindow(charcodes)) {
            _nullifiers[result.nullifier] = true; // Mark nullifier as used

            // Extract names which was disclosed from verification
            string[] memory names = CircuitAttributeHandler.getName(charcodes);

            // get recovered_address
            address recovered_address =
                address(uint160(proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_USER_IDENTIFIER_INDEX]));

            // set user as registered
            _registeredCelebrants[recovered_address] = true;

            // store names with nullifier
            _celebrant_names[recovered_address] = names;

            // Emit event
            emit NewCelebrant(recovered_address, block.timestamp);
        } else {
            revert("Not eligible: Not within 5 days of birthday");
        }
    }

    // Function to send a birthday gift
    function sendBirthdayGift(address celebrant, uint256 amount) public {
        // Ensure the user is registered
        if (!isCelebrantRegistered(celebrant)) {
            revert UnRegisteredCelerbrant();
        }

        // Ensure the celebrant's route is Money
        if (birthdayRecords[celebrant].route != BirthdayRoute.Money) {
            revert OnlyMoneyRoute();
        }

        // Transfer the specified amount of tokens
        IERC20(birthdayRecords[celebrant].token).transferFrom(msg.sender, celebrant, amount);

        // Update the total gifts received
        birthdayRecords[celebrant].moneyGiftsReceived += amount;

        // Emit an event for the gift
        emit NewGiftReceived(msg.sender, celebrant, amount);
    }

    // Function to retrieve a user's birthday record
    function getBirthdayRecord(address celebrant) public view returns (BirthdayRecord memory) {
        return birthdayRecords[celebrant];
    }

    // Check if proof registered
    function isCelebrantRegistered(address celebrant) public view returns (bool) {
        return _registeredCelebrants[celebrant];
    }

    // Get celebrant name
    function getCelebrantName(address celebrant) public view returns (string[] memory) {
        return _celebrant_names[celebrant];
    }
    // Internal function to check if the user is within the birthday window

    function _isWithinBirthdayWindow(bytes memory charcodes) internal view returns (bool) {
        // Extract the date of birth
        string memory dob = CircuitAttributeHandler.getDateOfBirth(charcodes);

        // Parse the day and month from the date of birth
        bytes memory dobBytes = bytes(dob);
        bytes memory dayBytes = new bytes(2);
        bytes memory monthBytes = new bytes(2);

        dayBytes[0] = dobBytes[0];
        dayBytes[1] = dobBytes[1];

        monthBytes[0] = dobBytes[3];
        monthBytes[1] = dobBytes[4];

        string memory day = string(dayBytes);
        string memory month = string(monthBytes);

        // Construct the date of birth for the current year
        string memory dobInThisYear = string(abi.encodePacked("25", month, day));
        uint256 dobInThisYearTimestamp = Formatter.dateToUnixTimestamp(dobInThisYear);

        // Calculate the time difference
        uint256 currentTime = block.timestamp;
        uint256 timeDifference;

        if (currentTime > dobInThisYearTimestamp) {
            timeDifference = currentTime - dobInThisYearTimestamp;
        } else {
            timeDifference = dobInThisYearTimestamp - currentTime;
        }

        // Check if the time difference is within 5 days
        uint256 fiveDaysInSeconds = 5 days;
        return timeDifference <= fiveDaysInSeconds;
    }
}
