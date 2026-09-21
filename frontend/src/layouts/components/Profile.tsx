import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { CircleUser } from 'lucide-react';

export default function Profile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center">
                    <CircleUser size={25} className="text-muted-foreground" />
                    <div className="flex flex-col">
                        <span className="font-bold text-[14px]">Moni Roy</span>
                        <span className="font-semibold text-[12px] text-muted-foreground">Admin</span>
                    </div>
                    <ChevronDown size={20} color="#565656" className="border border-gray-300 rounded-[50%]" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
