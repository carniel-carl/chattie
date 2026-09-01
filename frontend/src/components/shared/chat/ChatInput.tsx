import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChatInput({ value, onChange, onSubmit, disabled }: any) {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t border-base-300">
      <div className="flex items-center gap-3">
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
          className="flex-1 rounded-xl"
        />
        <Button
          type="submit"
          disabled={disabled}
          className=" bg-linear-to-r from-amber-500 to-orange-500 border-none disabled:btn-disabled"
        >
          <SendIcon className="size-5" />
        </Button>
      </div>
    </form>
  );
}
