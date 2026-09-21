import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import flagEn from '@/assets/images/flag-united-kingdom.svg';

export default function LanguageSwitch() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center">
                    <img src={flagEn} alt="English" width="25" height="25" />
                    <span>Language</span>
                    <ChevronDown size={20} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>VietNamese</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
