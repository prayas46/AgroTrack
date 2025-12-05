import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { MatchWithMarketParticipantsOutput } from "@/ai/flows/match-with-market-participants";
import { Progress } from "@/components/ui/progress";

function getBadgeVariant(type: string) {
  switch (type) {
    case 'buyer': return 'default';
    case 'supplier': return 'secondary';
    case 'storage unit': return 'outline';
    case 'transport provider': return 'destructive';
    default: return 'default';
  }
}

export function MarketplaceResults({
  data,
}: {
  data: MatchWithMarketParticipantsOutput;
}) {

  if (!data.matches || data.matches.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-semibold">No matches found</h3>
        <p className="text-muted-foreground">
          The AI could not find any partners based on your criteria. Please try adjusting your inputs.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Potential Market Matches</CardTitle>
        <CardDescription>
          Here are the partners our AI has identified for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Relevance</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.matches.map((match, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{match.name}</span>
                      <span className="text-xs text-muted-foreground">{match.contactInformation}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(match.type)} className="capitalize">{match.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Progress value={match.relevanceScore} className="h-2 w-20"/>
                        <span>{match.relevanceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{match.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
