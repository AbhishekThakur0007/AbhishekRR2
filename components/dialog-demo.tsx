import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { LoginForm } from "./login-form";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="submit"
          size="icon"
          className="bg-white hover:bg-slate-100 text-indigo-600 rounded-md"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
