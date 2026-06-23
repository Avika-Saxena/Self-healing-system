import { Badge, Tag, Space, Typography } from 'antd';
import { SafetyCertificateOutlined, WifiOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function Header({ agentOnline, lastSync }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-dark-400/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <SafetyCertificateOutlined style={{ fontSize: 20, color: '#0a0e17' }} />
          </div>
          <Badge
            status="success"
            className="absolute -top-0.5 -right-0.5"
            style={{ position: 'absolute', top: -2, right: -2 }}
          />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white m-0">Aegis</h1>
          <Text className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
            Self-Healing Infrastructure Dashboard
          </Text>
        </div>
      </div>
      <Space size="middle">
        <Tag
          icon={<WifiOutlined />}
          color={agentOnline ? 'success' : 'error'}
          className="!text-xs !font-semibold !px-4 !py-1 !rounded-full !border"
          style={{
            background: agentOnline ? 'rgba(13, 53, 38, 0.4)' : 'rgba(61, 20, 20, 0.4)',
            borderColor: agentOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          }}
        >
          {agentOnline ? 'Healing Agent Online' : 'Agent Offline'}
        </Tag>
        <Text className="!text-[11px] !text-slate-500 font-mono">Last sync: {lastSync}</Text>
      </Space>
    </header>
  );
}
