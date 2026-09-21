import { CircleUser, TrendingUp, TrendingDown } from 'lucide-react';

const counterList = [
  {
    name: 'Total User',
    value: 100,
    icon: <CircleUser size={25} className="text-muted-foreground" />,
    type: "up",
  },
  {
    name: 'Total User',
    value: 100,
    icon: <CircleUser size={25} className="text-muted-foreground" />,
    type: "down",
  },
  {
    name: 'Total User',
    value: 100,
    icon: <CircleUser size={25} className="text-muted-foreground" />,
    type: "up",
  },
  {
    name: 'Total User',
    value: 100,
    icon: <CircleUser size={25} className="text-muted-foreground" />,
    type: "down",
  },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl mb-5 font-medium">Dashboard</h1>
      <div className="flex gap-4">
        {counterList.map((counter, index) => (
          <div key={index} className="flex-1 items-center gap-2 bg-white rounded-md p-3 px-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p>{counter.name}</p>
                <span className="font-bold text-[30px]">{counter.value.toLocaleString()}</span>
              </div>
              {counter.icon}
            </div>
            <div className="">
              <p>
                {counter.type === "up" ? (
                  <TrendingUp size={16} className="inline-block mr-2 text-green-500" />
                ) : (
                  <TrendingDown size={16} className="inline-block mr-2 text-red-500" />
                )}{" "}
                {counter.type === "up" ? "Up" : "Down"} from yesterday
              </p>
            </div>
          </div>

        ))}
      </div>
    </div>
  )
}
