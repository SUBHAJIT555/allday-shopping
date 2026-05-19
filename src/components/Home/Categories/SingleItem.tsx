import { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link
      href={`/shop?category=${item.slug}`}
      className="group flex flex-col items-center px-1 py-2"
    >
      <div className="relative mb-4 w-full max-w-[140px] overflow-hidden rounded-2xl border border-blue-light-4/70 bg-gradient-to-b from-white to-blue-light-5 p-4 shadow-[0_8px_24px_-10px_rgba(147,51,234,0.15)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-light-3 group-hover:shadow-[0_16px_40px_-12px_rgba(147,51,234,0.22)]">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/0 via-blue/0 to-blue-light-4/0 transition-all duration-300 group-hover:from-blue/5 group-hover:via-blue-light-5/40 group-hover:to-blue-light-4/30"
          aria-hidden
        />

        <div className="relative z-1 flex h-[100px] items-center justify-center sm:h-[110px]">
          <Image
            src={item.img}
            alt={item.title}
            width={90}
            height={70}
            className="h-auto max-h-[72px] w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
      </div>

      <h3 className="line-clamp-2 max-w-[130px] text-center text-custom-sm font-semibold leading-snug text-dark transition-colors duration-200 group-hover:text-blue">
        {item.title}
      </h3>
    </Link>
  );
};

export default SingleItem;
