import React, { Suspense } from "react";

import { PropLayout } from "../../types/base";
import Modal from "../common/modal/modal";
import Loading from "../common/loading";

type ISuspenseWrapper = PropLayout;

const SuspenseWrapper = ({ children }: ISuspenseWrapper) => {

  return (
    <Suspense
      fallback={
        <Modal
          isOpen={true}
        >
          <Loading />
        </Modal>
      }
    >
      {children}
    </Suspense>
  )
}

export default React.memo(SuspenseWrapper);
