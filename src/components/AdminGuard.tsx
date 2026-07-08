"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const { user, loading } = useAuth();

  const [verificando, setVerificando] = useState(true);


useEffect(() => {

  verificarAdmin();

}, [user, loading]);



async function verificarAdmin() {


  if (loading) return;


  if (!user) {

    router.replace("/");

    return;

  }


  const { data, error } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();


  if (error) {

    console.error("Erro admin:", error);

    router.replace("/");

    return;

  }


  console.log("ADMIN:", data);


  if (!data?.is_admin) {

    router.replace("/");

    return;

  }


  setVerificando(false);

}


  if (verificando) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando acesso...
      </div>
    );

  }



  return <>{children}</>;

}