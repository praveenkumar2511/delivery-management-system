import * as React from "react";
import {
  BookOpen,
  // Bot,
  // Bot,
  // Command,
  LifeBuoy,
  Send,
  // Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CandereC from "@/assets/CandereC.svg";
import AI from "@/assets/PngItem_1066881.svg"
import { useNavigate } from "react-router-dom";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Ensure it's an object
  console.log(user.full_name, ".>>>>>>>>>>>>>>>>>>>>>>>..");
  const navigate = useNavigate();

  const data = {
    user: {
      name: user?.data?.user?.name,
      email: "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      // {
      //   title: "Daily Updates",
      //   url: "/dailyupdate",
      //   icon: Bot,
      // },
      // {
      //   title: "Reports",
      //   url: "#",
      //   icon: BookOpen,
      //   items: [
      //     {
      //       title: "All Reports",
      //       url: "/reports", // ✅ Nested under /reports
      //     },
      //     // {
      //     //   title: "Sales Report",
      //     //   url: "/reports/salesreport",  // ✅ Nested under /reports
      //     // },
      //     // {
      //     //   title: "Sales Return",
      //     //   url: "/reports/salesreturn",
      //     // },
      //     // {
      //     //   title: "Stock Outward",
      //     //   url: "/reports/stockoutward",
      //     // },
      //     // {
      //     //   title: "Stock Inward",
      //     //   url: "/reports/stockinward",
      //     // },
      //     // {
      //     //   title: "Purchase Report",
      //     //   url: "/reports/purchasereport",
      //     // },
      //     // {
      //     //   title: "Purchase Return Report",
      //     //   url: "/reports/purchasereturnreport",
      //     // },
      //   ],
      // },
      // {
      //   title: "Daily Updates",
      //   url: "/salesinvoice",
      //   icon: Settings2,
      // },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
    // ],
  };
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))] gradient "
      {...props}
    >
      <SidebarHeader className="gradient">
        <SidebarMenu className="gradient">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">

                </div> */}
                <div className="w-8 hidden lg:block">
                  <div
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer"
                  >
                    <img src={AI} alt="Gold" className="h-auto w-full" />
                  </div>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold pt-2 text-xl text-gray-800">AI World</span>
                  <span className="truncate text-xs"></span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="text-gray-800">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
