import { ReactNode, useState } from "react";
import { cn } from "@/core/lib/utils";
import {
  Tabs as TabsRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/shadcn/tabs";

interface TabProps {
  label: string | ReactNode;
  children: ReactNode;
  hasError?: boolean;
  errorMessage?: string;
  onBlur?: () => void;
}

interface TabsProps {
  tabs: TabProps[];
  showErrors?: boolean;
  isDataLoading?: boolean;
  initialTab?: number;
  /** Clases extra de la barra de pestañas (p. ej. su margen lateral). */
  listClassName?: string;
  /** Clases extra del contenedor de los paneles. */
  contentClassName?: string;
}

/**
 * Pestañas sobre los Tabs de shadcn (Radix): se recorren con las flechas y se
 * anuncian como tablist/tab/tabpanel. La API no cambia.
 *
 * `forceMount` en cada panel es imprescindible: Radix desmonta las pestañas
 * inactivas y ModalIngreso / ModalSolicitudEquipo tienen un formulario
 * repartido entre pestañas; sin esto se perdería lo escrito al cambiar de
 * pestaña. Los paneles inactivos se ocultan por CSS, como antes.
 */
export const Tabs = ({
  tabs,
  showErrors = false,
  isDataLoading = false,
  initialTab = 0,
  listClassName,
  contentClassName,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (index: number) => {
    if (activeTab !== index && tabs[activeTab].onBlur) {
      tabs[activeTab].onBlur!();
    }
    setActiveTab(index);
  };

  return (
    <TabsRoot
      value={String(activeTab)}
      onValueChange={(value) => handleTabChange(Number(value))}
      className="flex h-full min-h-0 flex-col"
    >
      {/* Pestañas */}
      <div className="relative">
        <TabsList className={listClassName}>
          {tabs.map((tab, index) => {
            const showError = !!tab.hasError && showErrors;
            return (
              <div key={index}>
                <TabsTrigger
                  value={String(index)}
                  // group: la etiqueta puede reaccionar a la pestaña activa
                  // (group-data-[state=active]:…).
                  className={cn(
                    "group",
                    showError &&
                      "text-red-600 hover:text-red-600 data-[state=active]:text-red-600 data-[state=active]:hover:text-red-600 dark:text-red-400 dark:hover:text-red-400 dark:data-[state=active]:text-red-400"
                  )}
                >
                  {tab.label}
                </TabsTrigger>

                {showError && tab.errorMessage && (
                  <div
                    role="alert"
                    className="absolute z-10 px-3 py-2 text-sm text-nowrap font-medium text-white bg-red-600 rounded-md shadow-lg left-0 -bottom-10 mt-1"
                  >
                    {tab.errorMessage}
                  </div>
                )}
              </div>
            );
          })}
        </TabsList>
      </div>

      <div className={cn("mt-1 min-h-0 flex-1", contentClassName)}>
        {tabs.map((tab, index) => (
          <TabsContent
            key={index}
            value={String(index)}
            forceMount
            className="mt-0 h-full min-h-0 data-[state=inactive]:hidden"
          >
            {tab.children}
          </TabsContent>
        ))}
        {isDataLoading && (
          <div className="absolute inset-0 bg-slate-100 bg-opacity-50 flex items-center justify-center z-50 dark:bg-slate-700">
            <div className="bg-white p-4 rounded-lg shadow-sm dark:bg-slate-800">
              <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </TabsRoot>
  );
};
