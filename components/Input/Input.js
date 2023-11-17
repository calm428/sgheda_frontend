import clsx from "clsx";

const ButtonVariant = {
    primary: "btn--primary",
    secondary: "btn--secondary",
    outline: "btn--outline",
    black: "btn--black"
};

export const Input = ({
    label = "",
    name = "",
    type = "text",
    placeholder = "",
    error = false,
    errorText = "",
    className = "",
    others,
    onChange = () => {}
}) => {
    return (
        <div className={clsx("w-full flex flex-col", className)}>
            <label htmlFor={name} className="mb-1 text-white text-title">
                {label}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                {...others}
                className={`shadow appearance-none border ${
                    error ? "border-red-500" : "border-[#17234F]"
                } text-content rounded w-full py-2 px-3 text-white bg-[#09112D] leading-tight focus:outline-none focus:shadow-outline`}
            />
            {error && <div className="text-red-500">{errorText}</div>}
        </div>
    );
};
