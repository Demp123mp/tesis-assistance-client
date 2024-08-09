"use client";

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/stores/user/user.store';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const LogoutButton = () => {
    const logout = useAuthStore((state) => state.logout); 
    const router = useRouter();
    const handleLogout = () => {
        logout(); 
        router.push('/auth'); 
    };

    return (
        <TooltipProvider>
            <Tooltip delayDuration={.2}>
                <TooltipTrigger>
                    <Button
                        onClick={handleLogout}
                        variant={"destructive"}
                        size={"icon"}
                    >
                        <LogOut size={18}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='dark:bg-red-800/70 bg-red-600/70 text-white'>
                    <p>Cerrar sesión</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default LogoutButton;
