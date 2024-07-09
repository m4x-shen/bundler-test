import * as React from 'react';

interface MyComponentProps extends React.ComponentPropsWithRef<'div'> {
    someProp: string;
    anotherProp: string;
}
declare const MyComponent: React.ForwardRefExoticComponent<Omit<MyComponentProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface MyComponentProps2 extends React.ComponentPropsWithoutRef<'div'> {
    someProp: string;
    anotherProp: string;
}
declare const MyComponent2: React.ForwardRefExoticComponent<MyComponentProps2 & React.RefAttributes<HTMLDivElement>>;
interface MyComponentProps3 extends React.ComponentPropsWithRef<'div'> {
    someProp: string;
    anotherProp: string;
}
declare const MyComponent3: ({ someProp, ...props }: MyComponentProps3) => React.JSX.Element;
interface MyComponentProps4 {
    someProp: string;
    anotherProp: string;
}
declare const MyComponent4: React.ForwardRefExoticComponent<MyComponentProps4 & React.RefAttributes<HTMLDivElement>>;

export { MyComponent, MyComponent2, MyComponent3, MyComponent4 };
