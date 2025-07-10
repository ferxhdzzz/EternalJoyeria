import { cn } from "../../lib/utils"
import { Avatar, AvatarImage } from "./avatar"

/**
 * @typedef {Object} TestimonialAuthor
 * @property {string} name - Nombre del autor
 * @property {string} handle - Handle o usuario del autor
 * @property {string} avatar - URL de la imagen de avatar
 */

/**
 * @typedef {Object} TestimonialCardProps
 * @property {TestimonialAuthor} author - Información del autor
 * @property {string} text - Texto del testimonio
 * @property {string} [href] - Enlace opcional
 * @property {string} [className] - Clases CSS adicionales
 */

/**
 * Componente de tarjeta de testimonio
 * @param {TestimonialCardProps} props
 */
export function TestimonialCard({
  author,
  text,
  href,
  className
}) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "p-4 text-start sm:p-6",
        "hover:from-muted/60 hover:to-muted/20",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        className
      )}>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none">
            {author.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-muted-foreground">
        {text}
      </p>
    </Card>
  );
}