import {
  Toast,
  ToastTitle,
  Toaster,
  useToastController,
} from "@fluentui/react-components";

export const toasterId = "app-toaster";

export function AppToaster() {
  return (
    <Toaster
      toasterId={toasterId}
      position="top-end"
      timeout={3000}
    />
  );
}

export function useToast() {
  const { dispatchToast } = useToastController(toasterId);

  return {
    success: (message: string) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
        </Toast>,
        {intent: 'success'}
      );
    },
    error: (message: string) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
        </Toast>,
        {intent: 'error'}
      );
    },
    warning: (message: string) => {
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
        </Toast>,
        {intent: 'warning'}
      );
    },
  };
}