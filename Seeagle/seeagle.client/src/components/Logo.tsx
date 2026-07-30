export function Logo() {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/logo.png"
                alt="Seeagle logo"
                className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover"
            />
            <span className="font-bold text-base sm:text-lg text-gray-800">
                Seeagle
            </span>
        </div>
    );
}