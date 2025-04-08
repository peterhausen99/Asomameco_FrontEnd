import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    user: "Admin",
    action: "registró asistencia de",
    target: "Juan Pérez",
    event: "Asamblea General",
    time: "hace 5 minutos",
    userInitial: "A",
  },
  {
    user: "Admin",
    action: "creó un nuevo evento",
    target: "Capacitación Médica",
    event: "",
    time: "hace 1 hora",
    userInitial: "A",
  },
  {
    user: "María López",
    action: "actualizó datos de",
    target: "Carlos Rodríguez",
    event: "",
    time: "hace 3 horas",
    userInitial: "ML",
  },
  {
    user: "Admin",
    action: "importó",
    target: "25 nuevos asociados",
    event: "",
    time: "hace 1 día",
    userInitial: "A",
  },
  {
    user: "José Gómez",
    action: "generó reporte de",
    target: "Asistencia Mensual",
    event: "",
    time: "hace 2 días",
    userInitial: "JG",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.userInitial}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
              <span className="font-semibold">{activity.target}</span>
              {activity.event && (
                <>
                  {" "}
                  en <span className="font-semibold">{activity.event}</span>
                </>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

