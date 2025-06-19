// import * as React from "react";
// import { CaretSortIcon, CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

// // import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// // import {
// //   Command,
// //   CommandGroup,
// //   CommandInput,
// //   CommandItem,
// // } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { ComboboxType } from "./type";
// import _ from "lodash";

// export function ComboSelect(props?: ComboboxType) {
//   const [open, setOpen] = React.useState<boolean>(false);
//   const [filter, setFilter] = React.useState<string>("");

//   return (
//     <Popover
//       open={open}
//       onOpenChange={() => {
//         setOpen(!open);
//         setFilter("");
//       }}
//       modal={true}
//     >
//       <PopoverTrigger asChild disabled={props?.disabled}>
//         <Button
//           tabIndex={props?.tabIndex ? props?.tabIndex : 0}
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className={` px-2   border-input w-full ${props?.className} `}
//         >
//           <div className="w-[90%]   gap-1 overflow-x-clip flex justify-start">
//             {props?.value?.length > 0 ? (
//               <>
//                 {props?.list?.find((item: any) => {
//                   return props?.value?.includes(item?.value);
//                 })?.colorCode ? (
//                   <span
//                     className="w-4 h-4 mt-0.5 rounded-full"
//                     style={{
//                       backgroundColor: props?.list?.find((item: any) => {
//                         return props?.value?.includes(item?.value);
//                       })?.colorCode,
//                       color: "transparent",
//                     }}
//                   >
//                     ---
//                   </span>
//                 ) : (
//                   <></>
//                 )}

//                 {
//                   props?.list?.find((item: any) => {
//                     return props?.value?.includes(item?.value);
//                   })?.label
//                 }
//               </>
//             ) : (
//               props?.placeholder || "Select..."
//             )}
//           </div>
//           <div className="flex">
//             {props?.icon && (
//               <span
//                 className={`w-4 h-4 rounded-full `}
//                 style={{ backgroundColor: props?.iconClassname }}
//               ></span>
//             )}

//             {!_.isEmpty(props?.value) && props?.isCancelable ? (
//               <Cross1Icon
//                 className="h-3 w-3 opacity-50"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   props?.clearFunction();
//                 }}
//               />
//             ) : (
//               <CaretSortIcon className="h-4 w-4 opacity-50" />
//             )}
//           </div>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className={`w-52 p-0 ${props?.contentClassName}`}>
//         <Command shouldFilter={false} className="max-h-60 overflow-auto">
//           {!props?.searchOff && (
//             <CommandInput
//               placeholder="Search data..."
//               value={filter}
//               onChangeCapture={(e: any) => {
//                 setFilter(e?.target?.value);
//               }}
//               className="h-9"
//             />
//           )}
//           <CommandGroup className="overflow-auto no-scrollbar">
//             {(() => {
//               const filteredList = props?.list?.filter((item) => {
//                 return item?.label
//                   ?.replace(/[_\s]/g, "")
//                   ?.toLowerCase()
//                   .startsWith(filter.toLowerCase());
//               });

//               if (!filteredList || filteredList?.length === 0) {
//                 return (
//                   <center>
//                     <p>No data found</p>
//                   </center>
//                 );
//               } else {
//                 return filteredList.map((data) => (
//                   <CommandItem
//                     key={data?.value}
//                     value={data?.value}
//                     onSelect={() => {
//                       props?.setValue?.(data?.value);
//                       setOpen(false);
//                     }}
//                   >
//                     <div className="flex items-center gap-2">
//                       {props?.dropDownIcon && (
//                         <span
//                           className="w-4 h-4 rounded-full"
//                           style={{ backgroundColor: data?.colorCode }}
//                         ></span>
//                       )}
//                       {data?.label}
//                     </div>

//                     <CheckIcon
//                       className={`ml-auto h-4 w-4 ${
//                         props?.value == data?.value
//                           ? "opacity-100"
//                           : "opacity-0"
//                       }`}
//                     />
//                   </CommandItem>
//                 ));
//               }
//             })()}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }
