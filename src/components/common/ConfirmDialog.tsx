import { useEffect, useId, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog === null) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-left text-slate-950 shadow-2xl backdrop:bg-slate-950/50"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>

        <p id={descriptionId} className="mt-2 text-sm text-slate-600">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer",
              destructive
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                : "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600 ",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
