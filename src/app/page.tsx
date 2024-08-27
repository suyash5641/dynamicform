import DynamicForm from "@/components/Home";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-24">
      <DynamicForm />
    </main>
  );
}
