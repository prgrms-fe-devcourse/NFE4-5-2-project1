type OnlyLiterals<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

type ReactInputType = OnlyLiterals<
  React.InputHTMLAttributes<HTMLInputElement>['type']
>;
type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> & {
  type?: Exclude<ReactInputType, 'radio' | 'checkbox' | 'range'>;
  label?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: InputProps) {
  const { label, value, onChange, ...rest } = props;
  return (
    <div className="relative">
      <input value={value} type={rest.type} onChange={onChange} {...rest} />

      <label
        className="absolute text-xl text-gray-400 duration-300 transform -translate-y-4 
        scale-80 top-7 origin-[0] px-5 peer-focus:px-5
         peer-focus:text-gray-400  peer-placeholder-shown:scale-100 
         peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-7 
         peer-focus:scale-80 peer-focus:-translate-y-4  start-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
