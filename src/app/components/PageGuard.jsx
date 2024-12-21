// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGlobal } from '@/utils/global';


const isAuthenticated = (user) => !!user?.accessToken;
const isUnauthenticated = (user) => !user?.accessToken;

const conditionMap = {
    isAuthenticated,
    isUnauthenticated,
};

export default function PageGuard({ children, condition, redirectPath }) {
    const { user } = useGlobal();
    // const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const shouldRedirect =
        isMounted &&
        (typeof condition === 'function'
            ? condition(user)
            : conditionMap[condition]?.(user));

    useEffect(() => {
        if (isMounted && shouldRedirect) {
            // router.replace(redirectPath);
            window.location.replace(redirectPath); 
        }
    }, [isMounted, shouldRedirect]);

    if (!isMounted || shouldRedirect) {
        return null; // Prevents rendering until mounted or redirect completes
    }

    return children;
}
