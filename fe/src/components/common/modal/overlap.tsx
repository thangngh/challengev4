import React from "react";

import Loading from "../loading";
import Modal from "./modal";

interface IOverlap {
  isOpen: boolean;
}

const Overlap = React.forwardRef<HTMLDialogElement, IOverlap>(
  ({ isOpen, ...props }: IOverlap, ref) => (
    <Modal
      isOpen={isOpen}
      ref={ref}
      {...props}
    >
      <Loading />
    </Modal>
));

Overlap.displayName = 'Overlap';
export default React.memo(Overlap);
