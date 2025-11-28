import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "@/services/api";
import { Product } from "@/types/product";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        staleTime: 1000,
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    });
};
