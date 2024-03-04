import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { Tabs } from "antd";

export default function EditorRightPanel() {
  const items = [
    {
      key: "components-fields",
      label: (
        <>
          <AppstoreOutlined />
          组件属性
        </>
      ),
      // 组件属性
    },
    {
      key: "page-fields",
      label: (
        <>
          <SettingOutlined />
          全局属性
        </>
      ),
      // 全局属性
    },
  ];

  return <Tabs defaultActiveKey="components-fields" items={items} />;
}
