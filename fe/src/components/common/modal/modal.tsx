import React from "react";
import { PropLayout } from "../../../types/base";


interface IModal extends PropLayout {
  isOpen: boolean;
}

const Modal = React.forwardRef<HTMLDialogElement, IModal>(
  ({ children, isOpen, ...props }: IModal, ref) => (
    <>
      <dialog
        className='modal bg-opacity-50'
        open={isOpen}
        {...props}
        ref={ref}
      >
        { children }
      </dialog>
    </>
  )
);

Modal.displayName = 'Modal';
export default React.memo(Modal);
