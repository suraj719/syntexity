import React, { useState } from 'react';
import { X } from 'lucide-react';

const TabEditor = ({ activeTab, tabs, onTabChange, onTabClose, onNewTab }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center bg-gray-800 text-white p-2">
        <div className="flex-1 flex overflow-x-auto">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 mr-2 cursor-pointer rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="mr-2">{tab.name}</span>
              <button
                className="p-1 hover:bg-gray-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded ml-2"
          onClick={onNewTab}
        >
          + New Tab
        </button>
      </div>
    </div>
  );
};

export default TabEditor;