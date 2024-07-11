import * as React from 'react';

interface MyComponentProps extends React.ComponentPropsWithRef<'div'> {
  someProp: string;
  anotherProp: string;
}

// in React.forwardRef<Ref, Props>
// when Props is extended from React.ComponentPropsWithRef
// the bundled type will be Pick<Props, ...>
export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ someProp, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className="test">
        {someProp}
      </div>
    );
  }
);

// the Pick behavior does not happen when Props is extended from React.ComponentPropsWithoutRef
interface MyComponentProps2 extends React.ComponentPropsWithoutRef<'div'> {
  someProp: string;
  anotherProp: string;
}

export const MyComponent2 = React.forwardRef<HTMLDivElement, MyComponentProps2>(
  ({ someProp, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        {someProp}
      </div>
    );
  }
);

// the Pick behavior does not happen when it is not using React.forwardRef
interface MyComponentProps3 extends React.ComponentPropsWithRef<'div'> {
  someProp: string;
  anotherProp: string;
}

export const MyComponent3 = ({ someProp, ...props }: MyComponentProps3) => {
  return <div {...props}>{someProp}</div>;
};

interface MyComponentProps4 {
  someProp: string;
  anotherProp: string;
}

// the Pick behavior does not happen when only using React.forwardRef
export const MyComponent4 = React.forwardRef<HTMLDivElement, MyComponentProps4>(
  ({ someProp, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        {someProp}
      </div>
    );
  }
);
