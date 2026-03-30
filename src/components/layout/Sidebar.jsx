import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Send,
  FileText,
  Briefcase,
  ClipboardList,
  CalendarCheck2,
  UserCircle2,
  Building2,
  Layers,
  LogOut,
} from "lucide-react";
import { getUserRole } from "../../lib/auth";
import logo from "../../assets/logo.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const candidatNav = [
    { to: "/dashboard-candidat", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cvs", label: "Mes CV", icon: FileText },
    { to: "/candidatures", label: "Candidatures", icon: ClipboardList },
    { to: "/rendez-vous", label: "Rendez-vous", icon: CalendarCheck2 },
    { to: "/envoi", label: "Envoi", icon: Send },
    { to: "/profil", label: "Profil", icon: UserCircle2 },
  ];

  const entrepriseNav = [
    { to: "/dashboard-entreprise", label: "Dashboard", icon: LayoutDashboard },
    { to: "/entreprise/offres", label: "Offres", icon: Layers },
    { to: "/entreprise/candidatures", label: "Candidatures", icon: ClipboardList },
    { to: "/rendez-vous", label: "Rendez-vous", icon: CalendarCheck2 },
    { to: "/profil", label: "Profil", icon: Building2 },
  ];

  const items = role === "entreprise" ? entrepriseNav : candidatNav;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-200/70 bg-[hsl(var(--card))]/90 backdrop-blur lg:block">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[hsl(var(--card))] px-4 py-3 shadow-sm">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl" />
          <div>
            <p className="text-gray-500">YourDreamJob</p>
            
          </div>
        </div>
      </div>
      <nav className="px-4">
        <div className="space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="mt-auto px-4 pb-6 pt-10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Se deconnecter
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
