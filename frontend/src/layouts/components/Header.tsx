import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { BellIcon, SearchIcon } from "lucide-react"
import LanguageSwitch from "./LanguageSwitch";
import Profile from "./Profile";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-3 px-10">
      <div className="w-[40%]">
        <InputGroup className="rounded-full bg-[#F5F6FA]">
          <InputGroupInput id="inline-start-input" placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex items-center gap-10">
        <div>
          <BellIcon className="text-muted-foreground" />
        </div>
        <LanguageSwitch />
        <Profile />
      </div>
    </header>
  )
}
