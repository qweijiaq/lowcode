import { Form } from "antd";
import type { FormInstance, FormItemProps, FormProps } from "antd";
import { useEffect, useMemo } from "react";
import type { FC, ReactNode } from "react";
import type {
  TComponentPropsUnion,
  TransformedComponentConfig,
} from "@lowcode/share";
import { objectOmit } from "@lowcode/share";
import { useStoreComponents } from "../../../hooks";

// Form表单的子项二次封装判断是否该隐藏
interface IFormPropLabelProps extends FormItemProps {
  prop: {
    isHidden: boolean;
  };
}
export const FormPropLabel: FC<IFormPropLabelProps> = (props) => {
  // 如果isHidden为true不展示该子项
  if (props.prop.isHidden) {
    return null;
  } else {
    // 判断完后，删除prop
    console.log("form子项的 props：", props);
    return (
      <Form.Item {...objectOmit(props, ["prop"])}>{props.children}</Form.Item>
    );
  }
};

// Form表单最外层二次封装组件
interface IFormContainer extends FormProps {
  config: TransformedComponentConfig<Record<string, any>>;
  onValuesChangeAfter?: (
    form: FormInstance,
    changedValues: Record<keyof TComponentPropsUnion["props"], any>
  ) => void;
}
export const FormContainer: FC<IFormContainer> = (props) => {
  const [form] = Form.useForm();
  const { updateCurrentComponent } = useStoreComponents();

  // 将数据转成一维，方便设置表单数据 {src:{xxx}} => {src:'xxx'}
  const propValues = useMemo(
    () =>
      Object.entries(props.config)
        .map(([key, value]) => {
          return { [key]: value.value };
        })
        .reduce((acc, cur) => {
          return { ...acc, ...cur };
        }, {}),
    [props.config]
  );

  useEffect(() => {
    form.setFieldsValue({ ...propValues });
  }, [form, propValues]);

  // 表单值改变重新更新 store 中的值
  function handleValuesChange(
    changedValues: Record<keyof TComponentPropsUnion["props"], any>
  ) {
    updateCurrentComponent(changedValues);
    // 二维码组件的单独处理背景颜色
    // props.onValuesChangeAfter?.(form, changedValues);
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      {...objectOmit(props, ["onValuesChangeAfter"])}
    >
      {props.children as ReactNode}
    </Form>
  );
};
