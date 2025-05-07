'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { FetchAllProjectsResponse, Project } from '@/apollo/types';
import { cleanDescription, projectUrl } from '@/lib/helpers';
import { useAppKitAccount } from '@reown/appkit/react';
import { ConnectButton } from '../buttons/ConnectButton';

interface Props {
  category: string;
  setProjectFn: React.Dispatch<React.SetStateAction<Project | null>>;
  setStepsFn: React.Dispatch<React.SetStateAction<number>>;
}

export default function Projects({ category, setProjectFn, setStepsFn }: Props) {
  const { isConnected } = useAppKitAccount();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skip, setSkip] = useState(0);
  const [fetchingMore, setFetchingMore] = useState(false);

  const limit = 10;

  const { data, loading, error, fetchMore } = useQuery<FetchAllProjectsResponse>(FETCH_ALL_PROJECTS, {
    variables: { category, skip: 0, limit },
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      setProjects(data.allProjects.projects);
    }
  });

  const handleFetchMore = async () => {
    setFetchingMore(true);
    const newSkip = skip + limit;

    const res = await fetchMore({
      variables: {
        category,
        skip: newSkip,
        limit
      }
    });

    const newProjects = res.data?.allProjects?.projects || [];
    if (newProjects.length) {
      setProjects((prev) => [...prev, ...newProjects]);
      setSkip(newSkip);
    }

    setFetchingMore(false);
  };

  if (loading && projects.length === 0) {
    return (
      <p className="text-[#FFF8C9] text-2xl font-bold mt-4">
        Loading projects...
      </p>
    );
  }

  if (error || !data?.allProjects?.projects?.length) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="text-[#FFF8C9] text-2xl font-bold">Failed to load Projects.</p>
        <button
          onClick={() => setStepsFn(0)}
          className="bg-yellow-400 text-[#2D0C72] px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <div className="text-center mb-4 -mt-4">
        <h1 className="text-[#FFF8C9] text-2xl sm:text-3xl font-bold leading-snug">
          Choose a project
        </h1>
        <p className="text-[#FFF8C9] text-base mt-1 opacity-80">
          Category: {category}
        </p>
      </div>

      <div className="w-full max-w-sm h-[600px] relative">
        <div className="overflow-y-auto py-2 max-h-[calc(100vh-400px)] space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {projects.map((project) => {
            const isSelected = selectedId === project.id;
            return (
              <div key={project.id} className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition-all">
                <button
                  onClick={() => {
                    if (isSelected) {
                      setSelectedId(null);
                      setProjectFn(null);
                    } else {
                      setSelectedId(project.id);
                      setProjectFn(project);
                    }
                  }}
                  className={`w-full text-left px-4 py-4 text-lg font-semibold flex justify-between items-center ${isSelected ? 'bg-teal-600 text-[#FFF8C9]' : 'bg-[#FFF1C6] text-[#2D0C72]'
                    }`}
                >
                  {project.title}
                  {isSelected && <CheckCircle2 className="w-5 h-5" />}
                </button>

                <AnimatePresence initial={false}>
                  {isSelected && project.descriptionSummary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-[#FFF1C6] px-4 py-3 text-sm text-[#2D0C72]"
                    >
                      <p className="mb-1">{cleanDescription(project.descriptionSummary)}</p>
                      <a
                        href={projectUrl(project.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline text-sm"
                      >
                        {projectUrl(project.slug)}
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {!selectedId && data.allProjects.totalCount > projects.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleFetchMore}
              disabled={fetchingMore}
              className="bg-yellow-400 text-[#2D0C72] px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-60"
            >
              {fetchingMore ? 'Loading more...' : 'Load More'}
            </button>
          </div>
        )}

        {selectedId && isConnected && (
          <div className="bg-gradient-to-t mt-5 from-[#2D0C72] pb-2">
            <button
              className="w-40 bg-yellow-400 text-[#2D0C72] py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
              onClick={() => setStepsFn(2)}
            >
              Continue
            </button>
          </div>
        )}

        {!isConnected && <ConnectButton />}
      </div>
    </div>
  );
}
