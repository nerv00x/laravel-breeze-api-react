export default function Spinner({ loading }) {
    return loading && <span className="block h-4 w-4 ring-r rounded-full border-2 border-r-transparent border-indigo-300 animate-spin"></span>;
}
