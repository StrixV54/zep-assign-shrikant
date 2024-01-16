import React, {
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";

export type OptionsType = {
  label: string;
  value: string;
  imgUrl: string;
  isChecked?: boolean;
  isHighlighted?: boolean;
};

export default function MutlipleSelectInput({
  optionsList,
  onSelect,
}: {
  optionsList: OptionsType[];
  onSelect?: (items: OptionsType[]) => void;
}) {
  //create new list with 2 additional fields to check selected and backspace highlighted
  const checkedOptions = useMemo(
    () =>
      optionsList.map((item) => ({
        ...item,
        isChecked: false,
        isHighlighted: false,
      })),
    []
  );
  //options has the main list with all properties
  const [options, setOptions] = useState<OptionsType[] | null>(checkedOptions);
  const [inputValue, setInputValue] = useState<string>("");

  //list with selected non-selected data and matching input value
  const filteredList = options?.filter(
    (item) =>
      !item?.isChecked &&
      (item?.value.includes(inputValue) || item?.label.includes(inputValue))
  );

  //list with selected data
  const selectedList = options?.filter((item) => item.isChecked);

  //return the selected values
  useEffect(() => {
    onSelect?.(
      selectedList!.map((item) => {
        const { isChecked, isHighlighted, ...newItem } = item;
        return newItem;
      })
    );
  }, [selectedList?.length]);

  //set checked value to data with given label
  const setChecked = (givenLabel: string, setTrue: boolean) => {
    setTrue && setInputValue("");
    setTrue && setFocused(false);
    setOptions(
      options?.map((item) =>
        item.label === givenLabel
          ? { ...item, isChecked: setTrue, isHighlighted: false }
          : { ...item, isHighlighted: false }
      )!
    );
  };

  //remove highlighted element, make it unchecked
  const removeCheckedAndHighlighted = (givenLabel: string) => {
    setOptions(
      options?.map((item) =>
        item.label === givenLabel
          ? { ...item, isChecked: false, isHighlighted: false }
          : item
      )!
    );
  };

  //track focus of input field
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setTimeout(() => setFocused(false), 500);

  //handle clicking of backspace
  const handleBackspace: KeyboardEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    if (inputValue.length === 0 && e.key === "Backspace") {
      if (selectedList?.length === 0) return;

      const lastElement = selectedList?.slice(-1)[0];
      if (lastElement?.isHighlighted)
        removeCheckedAndHighlighted(lastElement.label);
      else
        setOptions(
          options?.map((item) =>
            item.label === lastElement?.label
              ? { ...item, isHighlighted: true }
              : item
          )!
        );
    }
  };

  return (
    <div className="py-2 px-4 w-[800px] border rounded-3xl bg-white">
      <div
        className={`flex items-center justify-center flex-wrap border-b-[2px] ${
          focused ? "border-blue-600" : "border-slate-300"
        }`}
      >
        {selectedList!.map((item, idx) => (
          <div
            className={`flex flex-row h-min gap-1 border rounded-full justify-between items-center mr-1 mb-1 ${
              item.isHighlighted ? "bg-blue-400" : "bg-gray-300"
            }`}
            key={idx}
          >
            <img
              src={item.imgUrl}
              alt="avatar"
              className="h-6 w-6 rounded-full z-10 bg-white ring-1 ring-slate-300"
            />
            <span className="text-sm flex-nowrap">{item.label}</span>
            <button
              onClick={() => setChecked(item.label, false)}
              className="ml-0 rounded-full hover:bg-black/20 h-6 w-6"
            >
              x
            </button>
          </div>
        ))}
        <div className="relative flex-1">
          <input
            onFocus={onFocus}
            onKeyUp={handleBackspace}
            onBlur={onBlur}
            className="flex-1 w-full outline-none ml-1 min-w-[100px] p-0 m-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
          />
          {focused && filteredList?.length! > 0 && (
            <ul className="absolute flex flex-col bg-white w-[400px] translate-y-[10px] rounded-sm border-slate-300 border shadow-md z-10">
              {filteredList!.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setChecked(item.label, true)}
                  className="py-2 flex flex-row justify-between items-center px-3 hover:bg-gray-200"
                >
                  <img
                    src={item.imgUrl}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm flex-nowrap">{item.label}</span>
                  <span className="text-xs opacity-70">{item.value}</span>
                </button>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
