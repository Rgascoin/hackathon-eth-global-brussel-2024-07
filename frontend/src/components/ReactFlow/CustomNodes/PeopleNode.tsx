import { getIdBasedColor } from '@/utils/colors';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

interface PeopleNodeProps extends NodeProps {
  data: {
    label: string;
    allocatedBudget?: number;
    balance: number;
    people?: Array<{ name: string; photoUrl: string }>;
  };
}

const PeopleNode: React.FC<PeopleNodeProps> = ({ id, data }) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} isConnectable={true} />

      <div>
        <h2 className="text-sm font-medium text-White">{id}</h2>
        <div key={data.label} className="col-span-1 flex rounded-md shadow-sm">
          <div
            className={classNames(
              getIdBasedColor(id),
              'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
            )}
          >
            {/* {data.label.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')} */}
          </div>
          <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
            <div className="flex-1 truncate px-4 py-2 text-sm">
              <div className='flex justify-between '>
                <a href={"#"} className="font-medium text-gray-900 hover:text-gray-600">
                  {data.label}
                </a>
                <div className='flex '>
                  {/* <p className="text-gray-500">{nodes.filter(node => node.data.departmentId === id).length} Members</p> */}
                </div>
              </div>
              <div className='flex items-center gap-4 rounded-lg bg-white p-4'>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">Balance</p>
                  <p className="text-sm text-gray-500">{data?.balance?.toFixed(2) || 0} Circle</p>
                </div>
              </div>
            </div>
            <div className="shrink-0 pr-2">
              <button type="button">
                <span className="sr-only">Open options</span>
                <Menu as="div" className="ml-auto">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon className="size-5" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            Send<span className="sr-only"></span>
                          </a>
                        )}
                      </Menu.Item>
                     
                    </Menu.Items>
                  </Transition>
                </Menu>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} isConnectable={true} />
    </>
  );
};

export default PeopleNode;
