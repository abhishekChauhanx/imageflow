import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React from 'react'
import { toggleTheme } from "@/store/themeSlice";
const loginNav = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((s) => s.theme.mode);
    const dark = mode === "dark";
    return (
        <div className="lp-topbar">
            <span className="lp-logo">ImageFlow</span>
            <button
                className="lp-theme-btn"
                onClick={() => dispatch(toggleTheme())}
                aria-label="Toggle theme"
            >
                {dark ? "☀ Light" : "◐ Dark"}
            </button>
        </div>
    )
}

export default loginNav
