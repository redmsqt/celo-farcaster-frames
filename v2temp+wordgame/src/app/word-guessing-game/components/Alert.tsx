import { useEffect } from 'react';

interface AlertProps {
  alertValue: string;
  setAlertValue: React.Dispatch<React.SetStateAction<string>>;
}

const Alert: React.FC<AlertProps> = ({alertValue, setAlertValue}) => {

  useEffect(() => {
    if (alertValue !== "") {
      const timeoutId = setTimeout(() => {
        console.log('Timeout completed!');
        setAlertValue('');
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertValue, setAlertValue]);

  if (alertValue === "") {
    return null;
  }

  
  return(
    <div>
    <div className="flex items-center justify-center">
      <div className="w-fit h-8 border-8 rounded-md flex items-center justify-center m-0.5 bg-neutral-200 absolute top-10">
        <h1 className="text-sm font-bold text-black">{alertValue}</h1>
      </div>
    </div>
  </div>
  );
};

export default Alert;