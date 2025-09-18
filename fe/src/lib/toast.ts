import { toast } from "react-toastify"

const Toast = {
  success: (data: string) => {
    toast.success(data);
  },
  warning: (data: string) => {
    toast.warn(data);
  },
  error: (data: string) => {
    toast.error(data);
  },
  httpRequest: (request: Promise<unknown>, _pending?: string, _success?: string, _error?: string) => {
    toast.promise(request, {
      pending: _pending,
      success: _success,
      error: _error
    })
  }
}

export default Toast;
