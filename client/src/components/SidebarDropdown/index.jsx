import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function SidebarDropdown({ icon: Icon, title, items, open, seller }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            {/* Dropdown button */}
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`${seller ? 'seller-sider-link hover:text-[var(--primary)]' : 'sider-link hover:bg-[#fff]/20'} ${open && "!p-[12px] w-fit"}`}
            >
                <div className="flex items-center gap-2.5">
                    {Icon && <Icon size={16} />}
                    <span className={`sider-text ${open && "!hidden"}`}>{title}</span>
                </div>
                <FiChevronDown
                    className={`ml-auto transition-transform duration-200 ease-linear ${dropdownOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown links */}
            <div
                className={`flex flex-col overflow-hidden transition-all duration-300 ease-linear ${dropdownOpen ? "max-h-96" : "max-h-0"
                    }`}
            >
                {items.map((item, i) => (
                    <NavLink
                        key={i}
                        to={item.path}
                        className={({ isActive }) =>
                            `${seller ? 'seller-sider-link hover:text-[var(--primary)]' : 'sider-link hover:bg-[#fff]/20'} ${open && "p-[12px] w-full"} ${isActive && seller ? "seller-sider-link-active" : "sider-link-active"}`}
                    >
                        {/* <span className={`flex gap-2 ml-1.5 text-[12px] items-center sider-text ${open && "!hidden"}`}>
                            <span className={`w-1 h-1 rounded-full ${seller ? 'bg-black/75' : 'bg-[#fff]/75'}`}></span> {item.label}
                        </span> */}
                        <span className={`flex gap-2 ml-1.5 text-[12px] items-center sider-text text-black ${open && "!hidden"}`}>
  <span className={`w-1 h-1 rounded-full ${seller ? 'bg-black/75' : 'bg-black/75'}`}></span> {item.label}
</span>

                    </NavLink>
                ))}
            </div>
        </div>
    );
}