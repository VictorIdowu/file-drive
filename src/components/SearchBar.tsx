"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, SearchIcon } from "lucide-react";
import { SetStateAction } from "react";

interface Props {
  setQuery: React.Dispatch<SetStateAction<string>>;
  query: string;
}

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

const SearchBar = ({ setQuery, query }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setQuery(values.query);
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-1 items-center"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="rounded-full"
                    placeholder="Enter file name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            type="submit"
            className="flex items-center gap-2 hover:after:content-['Search'] rounded-full"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin" />
            )}
            <SearchIcon />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchBar;
