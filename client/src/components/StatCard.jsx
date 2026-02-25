import { Card, Statistic, Space, Skeleton } from "antd";

export default function StatCard({
  title,
  value,
  prefix,
  icon,
  loading,
  small,
  children,
}) {
  return (
    <Card className="rounded-xl flex flex-col justify-between h-full">
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Statistic
  title={<span className="font-semibold text-black">{title}</span>}
  value={value || 0}
  prefix={
    <Space className="flex items-baseline gap-1">
      {icon}
      <span>
        {prefix}
      </span>
    </Space>
  }
/>


          {children && (
            <div className="mt-60">
              {children}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
