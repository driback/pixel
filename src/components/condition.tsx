import React from "react";

import type { ReactNode } from "react";

type IfProps = {
  condition: boolean;
  children: ReactNode;
};

const If = ({ condition, children }: IfProps) => {
  return !condition ? null : <>{children}</>;
};

const Else = ({ children }: Pick<IfProps, "children">) => {
  return <>{children}</>;
};

type Condition = {
  children: ReactNode;
};

export const Condition = ({ children }: Condition) => {
  let ifChild: ReactNode = null;
  let otherwiseChild: ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === If) {
        const props = child.props as { condition: boolean };
        if (props.condition) {
          ifChild = child;
        }
      } else if (child.type === Else) {
        otherwiseChild = child;
      }
    }
  });

  return ifChild === null ? otherwiseChild : ifChild;
};

Condition.If = If;
Condition.Else = Else;
