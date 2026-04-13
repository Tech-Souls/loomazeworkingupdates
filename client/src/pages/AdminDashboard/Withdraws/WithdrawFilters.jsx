import { Select } from "antd";

export default function WithdrawFilters({ onChange }) {
  return (
    <div className="flex gap-3">
      <Select
        placeholder="Select Status"
        style={{ width: 200 }}
        onChange={(value) => onChange("status", value)}
        allowClear
      >
        <Select.Option value="pending">Pending</Select.Option>
        <Select.Option value="approved">Approved</Select.Option>
        <Select.Option value="rejected">Rejected</Select.Option>
      </Select>

      <Select
        placeholder="Select Type"
        style={{ width: 200 }}
        onChange={(value) => onChange("type", value)}
        allowClear
      >
        <Select.Option value="seller">Seller</Select.Option>
        {/* <Select.Option value="user">User</Select.Option> */}
      </Select>
    </div>
  );
}
