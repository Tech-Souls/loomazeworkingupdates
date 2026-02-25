import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Input, Button, Select, DatePicker, Row, Col, Tag, Space, message, Modal } from "antd";
import EarningsTable from "@/components/EarningsTable";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AdminReferrals() {
  const [filters, setFilters] = useState({ q: "", referrerType: "", startDate: null, endDate: null, page: 1, limit: 25 });
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ totalEarnings: 0, totalPaid: 0, totalPending: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 25 });
  const [loading, setLoading] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [earningsForSelected, setEarningsForSelected] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { q: filters.q || undefined, referrerType: filters.referrerType || undefined, startDate: filters.startDate ? filters.startDate : undefined, undefined, endDate: filters.endDate ? filters.endDate : undefined, page: filters.page, limit: filters.limit }
      const res = await axios.get(`${window.api}/referrals/admin/search`, { params });
      console.log("Referal  of Data",res.data.referrals);
      setReferrals(res.data.referrals || []);
      setPagination({ ...pagination, total: res.data.pagination?.total || 0, page: res.data.pagination?.page || filters.page });
      setStats(res.data.stats || { totalEarnings: 0, totalPaid: 0, totalPending: 0 });
    } catch (err) {
      console.log('err :>> ', err);
      message.error("Failed to load referrals");

    } finally {
      setLoading(false);
    }
  }, [filters]);


  useEffect(() => { load(); }, [load]);

  const onSearch = (val) => setFilters(f => ({ ...f, q: val, page: 1 }));

  const onRangeChange = (dates, dateStrings) => {
    setFilters(f => ({ ...f, startDate: dateStrings[0] || null, endDate: dateStrings[1] || null, page: 1 }));
  };

  const onReferrerTypeChange = (val) => setFilters(f => ({ ...f, referrerType: val, page: 1 }));

  const showEarnings = async (referral) => {
    setSelectedReferral(referral);
    setLoading(true);
    try {
      const res = await axios.get(`${window.api}/referrals/admin/referral/${referral._id}/earnings`);
      setEarningsForSelected(res.data.earnings || []);
    } catch (err) {
      console.log('err :>> ', err);
      window.toastify("Failed to load earnings", "error");
    } finally {
      setLoading(false);
    }
  };

  const openBackfillModal = () => {
    Modal.confirm({
      title: "Backfill signup earnings",
      content: "This will create signup earnings for all already-approved referred sellers. You can run for a specific seller only by providing their ID via the API. Proceed?",
      onOk: async () => {
        try {
          const res = await axios.post(`${window.api}/referrals/admin/backfill-signup-earnings`, {},);
          message.success(`Backfill complete. processed: ${res.data.processed}, created: ${res.data.created}`);
          load();
        } catch (err) {
          console.log('err :>> ', err);
          message.error("Backfill failed");
        }
      }
    });
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: "seller",
      render: s => s?.brandName || "—"
    },
    {
      title: "Referrer",
      dataIndex: "referrer",
      render: r => {
        if (!r?.id) return r?.referrerCode || "—";
        const ref = r.id;
        const name = ref.fullName || ref.username || ref.brandName || ref.email || ref.referralCode || "—";
        return <div>{name} <div style={{ fontSize: 12, color: "#888" }}>{r.type}</div></div>;
      }
    },
    {
      title: "Joined",
      dataIndex: "joinedAt",
      render: d => d ? new Date(d).toLocaleString() : "—"
    },
    {
      title: "Seller Status",
      dataIndex: "seller",
      render: s => {
        const st = s?.status || "—";
        return <Tag color={st === "approved" ? "green" : "gold"} className="capitalize">{st}</Tag>;
      }
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => showEarnings(record)}>Earnings</Button>
        );
      }
    }
  ];

  return (
    <div className="p-6">
      <Row gutter={16} align="middle" style={{ marginBottom: 12 }}>
        <Col flex="300px">
          <Input.Search
            placeholder="Search by brand name, referral code or seller"
            enterButton={<SearchOutlined />}
            onSearch={onSearch}
            defaultValue={filters.q}
            allowClear
          />
        </Col>
        <Col>
          <Select style={{ width: 160 }} placeholder="Referrer type" allowClear onChange={onReferrerTypeChange}>
            <Option value="users">Users</Option>
            <Option value="sellers">Sellers</Option>
          </Select>
        </Col>
        <Col>
          <RangePicker onChange={onRangeChange} />
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Space>
            <Button icon={<SyncOutlined />} onClick={() => load()}>Refresh</Button>
            <Button type="primary" onClick={openBackfillModal}>Backfill Signup Earnings</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Card>
            <div>Total Earnings</div>
            <h2>Rs {stats.totalEarnings ?? 0}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div>Total Paid</div>
            <h2>Rs {stats.totalPaid ?? 0}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div>Total Pending</div>
            <h2>Rs {stats.totalPending ?? 0}</h2>
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={referrals}
          loading={loading}
          rowKey={(r) => r._id}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: pagination.total,
            onChange: (page, pageSize) => setFilters(f => ({ ...f, page, limit: pageSize }))
          }}
        />
      </Card>

      <Modal
        open={!!selectedReferral}
        title={`Earnings for ${selectedReferral?.seller?.brandName || selectedReferral?.referrerCode || ""}`}
        footer={null}
        onCancel={() => { setSelectedReferral(null); setEarningsForSelected([]); }}
        width={900}
      >
        <EarningsTable 
          earnings={earningsForSelected}
          onActionComplete={() => { showEarnings(selectedReferral); load(); }}
        />
      </Modal>
    </div>
  );
}