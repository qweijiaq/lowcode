import { Form, Button } from "antd";
import { ulid } from "ulid";
import type { FormInstance, FormItemProps, FormProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { FC, ReactNode } from "react";
import type {
  TComponentPropsUnion,
  TransformedComponentConfig,
} from "@lowcode/share";
import { objectOmit } from "@lowcode/share";
import { toJS } from "mobx";
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

// 新增表单列表组件具体逻辑
interface FormListItemProps<T> {
  index: number;
  isExpand: boolean;
  newItemDefaultValue: T;
  children: ReactNode;
  onClick: () => void;
  keyName?: string;
}

export const FormListItem: FC<FormListItemProps<any>> = (props) => {
  const {
    updateCurrentCompConfigWithArray,
    updateCurrentComponent,
    getCurrentComponentConfig,
  } = useStoreComponents();

  // 每项的值发生改变触发事件修改 store 的值
  function handleValuesChange(changeValues: Record<string, any>) {
    // 转成二维数组，取第一个元素 key+value
    const objEntry = Object.entries(changeValues)[0];
    // {link:'xxx'}  =>   [[link,'xxx']]

    // 初始化时组件属性没有 key， updateCurrentComponent 修改值同时需要新增;
    console.log(toJS(getCurrentComponentConfig.get()?.props));

    if (
      (getCurrentComponentConfig.get()?.props as any)?.[
        props.keyName ?? "items"
      ] === undefined
    ) {
      updateCurrentComponent({
        [props.keyName ?? "items"]: [
          {
            ...props.newItemDefaultValue,
            ...changeValues,
          },
        ],
      });

      return;
    }

    // 二次修改 form 值，取对应 key 修改 store 值
    updateCurrentCompConfigWithArray({
      key: props.keyName ?? "items",
      field: objEntry[0],
      index: props.index,
      value: objEntry[1],
    });
  }

  // 删除无用 key 属性
  const values = { ...(objectOmit(props, ["key"] as any) as any) };

  const [form] = Form.useForm();

  // store 的数据改变触发 form 表单视图更新
  useEffect(() => {
    props.isExpand && form?.setFieldsValue({ ...values });
  }, [values]);

  return (
    <div className="border my-1 p-2" onClick={props.onClick}>
      {props.isExpand ? (
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          {props.children}
        </Form>
      ) : (
        <span className="cursor-pointer flex items-center justify-center">
          点击展开
        </span>
      )}
    </div>
  );
};

// 新增列表类型组件
interface FormContainerWithListProps<
  T extends { id: string } & Record<string, any>,
> {
  id: string;
  items: T[];
  children: ReactNode;
  newItemDefaultValue: T;
  keyName?: string;
}
export const FormContainerWithList: FC<FormContainerWithListProps<any>> = (
  props
) => {
  const { updateCurrentComponent } = useStoreComponents();
  const [expandIndex, setExpandIndex] = useState(0);

  // 新增或者切换轮播图的 id 变化重置第一项为展开
  useEffect(() => {
    setExpandIndex(0);
  }, [props.id]);

  // 添加新项按钮
  function addNewItem() {
    // 将新的数据更新 store
    updateCurrentComponent({
      [props.keyName ?? "items"]: [
        ...props.items,
        {
          ...props.newItemDefaultValue,
          id: ulid(),
        },
      ],
    });
  }
  return (
    <>
      <Button type="primary" onClick={addNewItem}>
        添加新项
      </Button>
      {props.items.map((item, index) => {
        return (
          <FormListItem
            {...item}
            index={index}
            key={item.id}
            isExpand={expandIndex === index}
            newItemDefaultValue={props.newItemDefaultValue}
            onClick={() => setExpandIndex(index)}
            keyName={props.keyName}
          >
            {props.children}
          </FormListItem>
        );
      })}
    </>
  );
};
