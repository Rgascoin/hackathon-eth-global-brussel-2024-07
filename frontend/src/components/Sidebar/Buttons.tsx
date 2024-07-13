import React from 'react';
import { BsArrowRepeat } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { SiCompilerexplorer } from 'react-icons/si';

interface ActionButtonProps {
	onClick: () => void;
	children: React.ReactNode;
	disabled?: boolean;
	className: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, disabled = false, className }) => (
	<button type="button" onClick={onClick} className={className} disabled={disabled}>
		{children}
	</button>
);

export const CompileButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
	<ActionButton
		onClick={onClick}
		className="flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 p-px"
	>
		<div className="m-px flex size-full items-center justify-center rounded-lg bg-black p-2 text-lg  text-white hover:bg-grey">
			<SiCompilerexplorer className="mr-2 size-5 fill-White" aria-hidden="true" />
			Compile deploy.sol
		</div>
	</ActionButton>
);

export const RunScriptButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
	<ActionButton
		onClick={onClick}
		className=" flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 p-px"
	>
		<div className="m-px flex size-full items-center justify-center rounded-lg bg-black p-2 text-lg  text-white hover:bg-grey">
			<BsArrowRepeat className="mr-2 size-5 fill-White" aria-hidden="true" />
			Run Script
		</div>
	</ActionButton>
);

export const PublishButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
	<ActionButton onClick={onClick} className="flex w-full items-center justify-center p-px">
		<div className="m-px  flex size-full items-center justify-center rounded-lg bg-grey p-2 text-sm italic text-white hover:bg-black">
			Deploy on Sepolia
			<FaEthereum className="ml-2 size-5 fill-White" aria-hidden="true" />
		</div>
	</ActionButton>
);
