import { useState } from 'react';
import { Button, InputNumber, Space, Tooltip } from 'antd';
import {
  ExperimentOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  DashboardOutlined,
  ExportOutlined,
  FireOutlined,
} from '@ant-design/icons';

export default function FailureSimulator({ onInjectFailure, syntheticLoad, onLoadChange }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const failureTypes = [
    { icon: <CloudServerOutlined />, label: 'Service', type: 'service' },
    { icon: <DashboardOutlined />, label: 'CPU', type: 'cpu' },
  ];

  const handleChaos = () => {
    setIsAnimating(true);
    const types = ['service', 'database', 'cpu'];
    onInjectFailure(types[Math.floor(Math.random() * types.length)]);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400 transition-all duration-300">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 rounded-lg">
            <ExperimentOutlined style={{ fontSize: 18, color: '#f87171' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white m-0">Failure Simulator</h3>
            <p className="text-[11px] text-slate-500 m-0">Crash services and watch the healing agent recover them in real time.</p>
          </div>
        </div>

        <Space size="middle" wrap>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Synthetic Load (req/s)</span>
            <InputNumber
              value={syntheticLoad}
              onChange={(val) => onLoadChange(val || 0)}
              min={0}
              max={10000}
              size="small"
              style={{ width: 90 }}
              className="!font-mono !text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 border-l border-dark-400 pl-3">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mr-1">Inject failure</span>
            {failureTypes.map((ft) => (
              <Tooltip title={ft.label} key={ft.type}>
                <Button
                  size="small"
                  icon={ft.icon}
                  onClick={() => onInjectFailure(ft.type)}
                  className="!bg-dark-500 hover:!bg-dark-400 !border-dark-300 hover:!border-red-500/30 !text-slate-400 hover:!text-red-400"
                />
              </Tooltip>
            ))}
          </div>

          <Button
            type="primary"
            danger
            icon={<FireOutlined />}
            onClick={handleChaos}
            loading={isAnimating}
            className="!font-bold !text-xs"
            style={{
              background: isAnimating
                ? '#dc2626'
                : 'linear-gradient(to right, #dc2626, #ef4444)',
              boxShadow: isAnimating ? '0 4px 15px rgba(239, 68, 68, 0.3)' : 'none',
              borderColor: 'transparent',
            }}
          >
            Chaos
          </Button>

          <Tooltip title="Open in new window">
            <Button
              size="small"
              icon={<ExportOutlined />}
              className="!bg-dark-500 hover:!bg-dark-400 !border-dark-300 !text-slate-400"
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
}
