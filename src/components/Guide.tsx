import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

interface Step {
  target: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const getSteps = (pageType: 'lookup' | 'distance' | 'unified'): Step[] => {
  const commonSteps = {
    country: {
      target: '.country-select',
      content: 'Select the country for your location',
      position: 'bottom' as const
    },
    search: {
      target: '.search-input',
      content: 'Type your search and press Enter ↵',
      position: 'bottom' as const
    }
  };

  switch (pageType) {
    case 'lookup':
      return [
        {
          target: '.location-type-select',
          content: 'First, select the type of search - LOCODE or Name',
          position: 'bottom'
        },
        commonSteps.country,
        {
          ...commonSteps.search,
          content: 'Enter LOCODE or port name and press Enter ↵'
        },
        {
          target: '.search-button',
          content: 'Click to search for ports',
          position: 'bottom'
        }
      ];
    case 'distance':
      return [
        {
          ...commonSteps.country,
          content: 'First, select origin country'
        },
        {
          ...commonSteps.search,
          content: 'Enter origin port LOCODE/name and press Enter ↵'
        },
        {
          target: '.dest-country-select',
          content: 'Now select destination country',
          position: 'bottom'
        },
        {
          target: '.dest-search-input',
          content: 'Enter destination port LOCODE/name and press Enter ↵',
          position: 'bottom'
        },
        {
          target: '.calculate-button',
          content: 'Finally, click to calculate the distance',
          position: 'top'
        }
      ];
    case 'unified':
      return [
        {
          target: '.location-type-select',
          content: 'First, select the type of location - Port or Postal/Door',
          position: 'bottom'
        },
        commonSteps.country,
        {
          ...commonSteps.search,
          content: 'Enter LOCODE/address and press Enter ↵'
        },
        {
          target: '.dest-type-select',
          content: 'Select destination location type',
          position: 'bottom'
        },
        {
          target: '.dest-country-select',
          content: 'Select destination country',
          position: 'bottom'
        },
        {
          target: '.dest-search-input',
          content: 'Enter destination LOCODE/address and press Enter ↵',
          position: 'bottom'
        },
        {
          target: '.calculate-button',
          content: 'Click to calculate the distance',
          position: 'top'
        }
      ];
  }
};

export const Guide: React.FC<{ 
  pageType: 'lookup' | 'distance' | 'unified';
  forceShow?: boolean;
  onClose?: () => void;
}> = ({ pageType, forceShow = false, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(forceShow);

  const steps = useMemo(() => getSteps(pageType), [pageType]);

  useEffect(() => {
    setIsOpen(forceShow);
  }, [forceShow]);


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOpen(false);
      localStorage.setItem(`hasSeenGuide_${pageType}`, 'true');
      if (onClose) onClose();
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem(`hasSeenGuide_${pageType}`, 'true');
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const currentTarget = document.querySelector(steps[currentStep]?.target);
  const targetRect = currentTarget?.getBoundingClientRect();

  if (!targetRect) return null;

  const getPopoverPosition = () => {
    const padding = 10;
    switch (steps[currentStep]?.position) {
      case 'top':
        return {
          top: `${targetRect.top - padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.left - padding}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.right + padding}px`,
          transform: 'translate(0, -50%)'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleSkip} />
      <div
        className="absolute bg-white p-4 rounded-lg shadow-lg max-w-xs"
        style={getPopoverPosition()}
      >
        <button
          onClick={handleSkip}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
        <p className="text-sm mb-4">{steps[currentStep]?.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}; 