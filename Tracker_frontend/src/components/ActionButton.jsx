export function ActionButton({ pb, onAction, label }) {
    return (
        <button onClick={onAction}>
            {label}
        </button>
    );
}