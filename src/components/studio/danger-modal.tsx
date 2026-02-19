"use client";

import { TriangleAlert } from "lucide-react";

export default function DangerModal() {
  return (
    <div className="z-10 flex items-center justify-center">
      <div className="flex items-end justify-center text-center sm:items-center sm:p-0 overflow-hidden">
        <div className="relative transform p-8 overflow-hidden rounded-lg text-left transition-all sm:w-full sm:max-w-lg sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-error/10 sm:mx-0 sm:size-10">
              <TriangleAlert aria-hidden="true" className="size-6 text-error" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-base font-semibold text-text">
                Deactivate account
              </h3>
              <div className="mt-2">
                <p className="text-sm text-muted">
                  Are you sure you want to deactivate your account? All of your
                  data will be permanently removed from our servers forever.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-onPrimary hover:bg-error/90 sm:ml-3 sm:w-auto"
            >
              Deactivate
            </button>
            <button
              type="button"
              data-autofocus
              className="mt-3 inline-flex w-full justify-center rounded-md bg-surface px-3 py-2 text-sm font-semibold text-text ring-1 ring-border ring-inset hover:bg-surface/90 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
