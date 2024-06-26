// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import * as FeatherIcons from "feather-icons-react";

interface IconPickerProps {
  rowsInOnePage: number;
  columnsInOnePage: number;
  iconHeight: number;
  iconWidth: number;
  pickerHeight?: number;
  pickerWidth?: number;
}

const PrevArrow = FeatherIcons.ChevronLeft;
const NextArrow = FeatherIcons.ChevronRight;

const IconPicker: React.FC<IconPickerProps> = ({
  rowsInOnePage,
  columnsInOnePage,
  iconHeight,
  iconWidth,
  pickerHeight = 500,
  pickerWidth = 500,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const iconNames = useMemo(
    () => Object.keys(FeatherIcons).filter((name) => name !== "default"),
    []
  );

  const totalPageIcons = rowsInOnePage * columnsInOnePage;
  const totalPages = Math.ceil(iconNames.length / totalPageIcons);

  const handleIconChange = useCallback((icon: string) => {
    setSelectedIcon(icon);
    setIsOpen(false);
  }, []);

  const handleTogglePicker = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((offset: number) => {
    setPage((prev) => prev + offset);
  }, []);

  const renderIcons = useMemo(() => {
    const start = page * totalPageIcons;
    const end = Math.min(start + totalPageIcons, iconNames.length);
    const pageIcons = iconNames.slice(start, end);

    return pageIcons.map((iconName, idx) => {
      const Icon = FeatherIcons[iconName as keyof typeof FeatherIcons];
 
      return (
        <div
          key={idx}
          className="flex items-center justify-center cursor-pointer bg-blue-500 rounded-md transition-all duration-200 p-2 hover:bg-blue-400"
          style={{ height: iconHeight, width: iconWidth }}
          onClick={() => handleIconChange(iconName)}
        >
          <Icon className="w-full h-full text-white" />
        </div>
      );
    });
  }, [
    iconNames,
    page,
    handleIconChange,
    iconHeight,
    iconWidth,
    totalPageIcons,
  ]);

  const SelectedIconComponent = selectedIcon
    ? FeatherIcons[selectedIcon as keyof typeof FeatherIcons]
    : null;

  return (
    <div className="relative">
      <div
        onClick={handleTogglePicker}
        className="bg-white w-24 h-24 rounded-md cursor-pointer flex items-center justify-center border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
        aria-expanded={isOpen}
      >
        {SelectedIconComponent && (
          <SelectedIconComponent className="w-3/4 h-3/4 text-gray-700" />
        )}
      </div>
      {isOpen && (
        <div
          style={{ height: pickerHeight, width: pickerWidth }}
          className="absolute flex flex-col bg-white space-y-5 p-6 rounded-md shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <p className="text-xl font-semibold">Select an Icon</p>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={handleTogglePicker}
            >
              <FeatherIcons.X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              disabled={page === 0}
              className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              onClick={() => handlePageChange(-1)}
            >
              <PrevArrow className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg">
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page === totalPages - 1}
              className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
              onClick={() => handlePageChange(1)}
            >
              <NextArrow className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div
            className="grid overflow-y-scroll p-2 gap-2"
            style={{
              gridTemplateColumns: `repeat(${columnsInOnePage}, minmax(0, 1fr))`,
              height: "100%",
            }}
          >
            {renderIcons}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
