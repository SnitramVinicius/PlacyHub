"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";


export default function AdminLayout({
 children,
}:{
 children: React.ReactNode;
}) {


 return (

  <AdminGuard>

    <div className="flex">

      <AdminSidebar />


      <main className="flex-1">

        {children}

      </main>


    </div>

  </AdminGuard>

 );

}